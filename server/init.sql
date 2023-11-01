CREATE SCHEMA IF NOT EXISTS `auction` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `auction` ;


-- -----------------------------------------------------
-- Table `auction`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `auction`.`user` (
  `id` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `nickname` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `auction`.` history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `auction`.`history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `item_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `auction`.`item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `auction`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `endTime` DATETIME NOT NULL,
  `startTime` DATETIME NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `content` TEXT NULL DEFAULT NULL,
  `price` DOUBLE NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `image` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_item_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_item_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `auction`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `auction`.`prehistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `auction`.`prehistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) NOT NULL,
  `item_id` int NOT NULL,
  `endTime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prehistory_user1_idx` (`user_id`),
  KEY `fk_prehistory_item1_idx` (`item_id`),
  CONSTRAINT `fk_prehistory_item1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `fk_prehistory_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
)

ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE USER 'user1'@'%' IDENTIFIED BY '1234';
GRANT ALL ON auction.* TO 'user1'@'%';