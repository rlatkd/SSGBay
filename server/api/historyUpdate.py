import pymysql
from datetime import datetime


connectionString = {
    'host': '172.17.14.241', # mysql-service의 IP
    'port': 3306,
    'database': 'auction',
    'user': 'user1',
    'password': '1234',
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.DictCursor
}


def moveExpiredItemsToHistory():
    try:
        with pymysql.connect(**connectionString) as con:
            cursor = con.cursor()
            
            # 현재 시간
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(current_time + ">>>")

            # 현재 시간을 기준으로 endTime이 지난 항목을 선택
            sql = "SELECT * FROM prehistory WHERE endTime < %s"
            cursor.execute(sql, (current_time,))
            expired_items = cursor.fetchall()
            
            if expired_items:
                for item in expired_items:
                    check_sql = "SELECT * FROM history WHERE item_id = %s"
                    cursor.execute(check_sql, (item['item_id'],))
                    existing = cursor.fetchone()

                    if existing:
                        update_sql = "UPDATE history SET user_id = %s WHERE item_id = %s"
                        cursor.execute(update_sql, (item['user_id'], item['item_id']))
                        con.commit()
                    else:
                        insert_sql = "INSERT INTO history (item_id, user_id) VALUES (%s, %s)"
                        cursor.execute(insert_sql, (item['item_id'], item['user_id']))
                        con.commit()

            print("Expired items moved to history table successfully.")

    except Exception as e:
        print("Error occurred:", e)

moveExpiredItemsToHistory()