FROM pymysql import connect
FROM datetime import datetime
import shutil
FROM flask import Flask, json, jsonify
FROM os import path
import pymysql


connectionString = {
    'host': '172.17.14.241', # mysql-service의 IP
    'port': 3306,
    'database': 'auction',
    'user': 'user1',
    'password': '1234',
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.DictCursor
}


def idCheck(user_id, pwd):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = 'SELECT * FROM user ' + 'WHERE id = %s and password = %s;'
            cursor.execute(sql, [user_id, pwd])
            result = cursor.fetchall()
            return result
        
    except Exception as e:
        print(e)


def getMyItem(user_id):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = 'SELECT * FROM item WHERE user_id = %s;'
            cursor.execute(sql, [user_id])
            result = cursor.fetchall()
            return result
        
    except Exception as e:
        print(e)        


def getItems(sort, keyword):
    try:
        query = 'SELECT * FROM item'
  
        if keyword:
            query += f' WHERE name LIKE '%{keyword}%' OR content LIKE '%{keyword}%''
                
        if sort == 'priceDown':
            query += ' ORDER BY price DESC'
        elif sort == 'priceUp':
            query += ' ORDER BY price ASC'
        else:
            query += ' ORDER BY startTime DESC'
            
        with connect(**connectionString) as con:
            cursor = con.cursor()
            cursor.execute(query)
            itemInfo = cursor.fetchall()
            cursor.close()
        
        if not itemInfo:
            return [], 200, { 'Content-Type': 'application/json'}
        return itemInfo, 200, { 'Content-Type': 'application/json'}

    except Exception as e:
        print(e)


def getItemDetails(id):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = 'SELECT * FROM item WHERE id = %s'
            cursor.execute(sql, (id, ))
            itemDetails = cursor.fetchone()
            cursor.close()
        return itemDetails, 200, { 'Content-Type': 'application/json'}

    except Exception as e:
        print(e)
        
        
def addUserInfo(userId, userPwd, userNickname, userPhone):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = f'''INSERT INTO user (id, password, nickname, phone) VALUES('{userId}','{userPwd}','{userNickname}','{userPhone}')'''
            print(cursor.execute(sql))
            userInfo = cursor.fetchall()
            con.commit()
        return userInfo, 200, { 'Content-Type': 'application/json'}    
            
    except Exception as e:
        print(e)


def getMyItem(user_id):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = 'SELECT * FROM item WHERE user_id = %s;'
            cursor.execute(sql, [user_id])
            result = cursor.fetchall()
            return result
        
    except Exception as e:
        print(e) 
                

def getBuyItem(user_id):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = 'SELECT item.* FROM item INNER JOIN history ON item.id = history.item_id WHERE history.user_id = %s;'
            cursor.execute(sql, [user_id])
            result = cursor.fetchall()
            print(result)
            return result
        
    except Exception as e:
        print(e)        

        
def addItemInfo(itemName, itemContent, itemPrice, itemImage, endTime, userId):
    
    with connect(**connectionString) as con:
            cursor = con.cursor()
            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            sql = 'INSERT INTO item (name, content, price, image, endTime, startTime, user_id) VALUES (%s, %s, %s, %s, %s, %s, %s)'
            cursor.execute(sql, (itemName, itemContent, itemPrice, itemImage, endTime, now, userId))
            con.commit()
    return '경매물품 등록 성공', 200
 

def getItemDetails(id):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = 'SELECT * FROM item WHERE id = %s'
            cursor.execute(sql, (id, ))
            itemDetails = cursor.fetchone()
            cursor.close()
        return itemDetails, 200, { 'Content-Type': 'application/json'}

    except Exception as e:
        print(e)
        
def updatePrice(id, new_price):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = 'UPDATE item SET price = %s WHERE id = %s'
            cursor.execute(sql, (new_price,id))
            con.commit()
            cursor.close()
            return {'message': '입찰되었습니다.'}, 200

    except Exception as e:
        print(e)
        return {'message': '가격 업데이트에 실패했습니다.'}, 500


def insertPrehistory(itemId, userId, endTime):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            formatted_date = datetime.strptime(endTime[:-4], '%a, %d %b %Y %H:%M:%S')
            formatted_date_for_mysql = formatted_date.strftime('%Y-%m-%d %H:%M:%S')
            sql = 'INSERT INTO prehistory (item_id, user_id, endTime) VALUES (%s, %s, %s)'
            cursor.execute(sql, (itemId, userId, formatted_date_for_mysql))
            con.commit()
            cursor.close()
            return {'message': '거래 저장'}, 200

    except Exception as e:
        print(e)
        return {'message': '거래 실패'}, 500
    

def deleteItem(userId):
    try:
        with connect(**connectionString) as con:
            cursor = con.cursor()
            sql = 'DELETE * FROM item WHERE user_id = %s'
            cursor.execute(sql, (userId))
            con.commit()
            cursor.close()
            return {'message': '삭제되었습니다.'}, 200

    except Exception as e:
        print(e)
        return {'message': '삭제에 실패했습니다.'}, 500