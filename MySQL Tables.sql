/*
SQLyog Enterprise v12.15 (64 bit)
MySQL - 5.6.21 : Database - se2
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`se2` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `se2`;

/*Table structure for table `current` */

DROP TABLE IF EXISTS `current`;

CREATE TABLE `current` (
  `pkey` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `symbol` varchar(5) DEFAULT NULL,
  `volume` int(11) DEFAULT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `ts` varchar(30) DEFAULT NULL,
  `create_ts` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pkey`)
) ENGINE=InnoDB AUTO_INCREMENT=9504 DEFAULT CHARSET=utf8;

/*Table structure for table `historical` */

DROP TABLE IF EXISTS `historical`;

CREATE TABLE `historical` (
  `symbol` varchar(4) NOT NULL,
  `datee` date NOT NULL,
  `open_price` decimal(6,2) unsigned DEFAULT NULL,
  `high_price` decimal(6,2) unsigned DEFAULT NULL,
  `low_price` decimal(6,2) unsigned DEFAULT NULL,
  `close_price` decimal(6,2) unsigned DEFAULT NULL,
  `volume` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`symbol`,`datee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `login_history` */

DROP TABLE IF EXISTS `login_history`;

CREATE TABLE `login_history` (
  `user` int(11) DEFAULT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `stock` */

DROP TABLE IF EXISTS `stock`;

CREATE TABLE `stock` (
  `pkey` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(11) DEFAULT NULL,
  `stock` varchar(25) DEFAULT NULL,
  `stock_name` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`pkey`),
  UNIQUE KEY `user_2` (`user`,`stock`),
  KEY `user` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `pkey` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pkey`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
