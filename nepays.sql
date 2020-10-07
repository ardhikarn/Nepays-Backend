-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2020 at 11:11 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nepays`
--

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `amount` int(11) NOT NULL,
  `category` int(1) NOT NULL COMMENT '1: send, 2: receive',
  `status` int(1) NOT NULL COMMENT '0: unseen, 1: seen',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `user_id`, `message`, `amount`, `category`, `status`, `created_at`) VALUES
(7, 4, 'Transfer to Samuel Suhi', 10000, 1, 1, '2020-10-04 11:28:03'),
(8, 5, 'Transfered from Nur Fauzan', 10000, 2, 0, '2020-10-04 11:28:03');

-- --------------------------------------------------------

--
-- Table structure for table `topup_history`
--

CREATE TABLE `topup_history` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `nominal` int(20) NOT NULL,
  `status` int(1) NOT NULL COMMENT '0: pending, 1: success',
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `topup_history`
--

INSERT INTO `topup_history` (`id`, `id_user`, `nominal`, `status`, `date`) VALUES
(5, 2, 20, 0, '2020-10-03 18:07:19'),
(6, 4, 50000, 0, '2020-10-05 10:40:13'),
(7, 4, 50000, 1, '2020-10-05 10:46:14');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `category` int(1) NOT NULL COMMENT '1: send, 2: receive',
  `note` text NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `user_id`, `target_id`, `amount`, `category`, `note`, `created`) VALUES
(1, 4, 8, 249000, 1, '', '2020-10-01 18:35:36'),
(2, 4, 7, 150000, 2, '', '2020-10-01 18:35:36'),
(3, 4, 6, 149000, 1, '', '2020-10-01 18:40:57'),
(4, 4, 5, 50000, 2, '', '2020-10-01 18:40:57'),
(5, 4, 1, 123000, 2, '', '2020-10-01 19:08:46'),
(6, 4, 5, 60000, 1, 'Buy some clothes', '2020-10-03 16:03:16'),
(7, 5, 4, 60000, 2, 'Buy some clothes', '2020-10-03 16:03:16'),
(8, 4, 5, 60000, 1, 'Buy some clothes', '2020-10-03 16:13:07'),
(9, 5, 4, 60000, 2, 'Buy some clothes', '2020-10-03 16:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `pin_code` varchar(200) NOT NULL COMMENT 'Bcrypt',
  `password` varchar(200) NOT NULL,
  `image` varchar(200) NOT NULL,
  `balance` int(11) NOT NULL,
  `status` int(1) NOT NULL COMMENT '0. Not Active, 1. Active',
  `reset_key` int(11) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `phone`, `pin_code`, `password`, `image`, `balance`, `status`, `reset_key`, `created`, `updated`) VALUES
(1, 'test', '1', 'test1@test.com', '081234567890', '', '12341234', 'blank-user.png', 0, 1, 0, '2020-10-01 06:47:53', '0000-00-00 00:00:00'),
(2, 'Test', '2', 'test2@test.com', '081234567891', '', '$2b$09$QPIghOajvwmpoqqQa5nWBOS7VLEFBG1P5O6/NJ1UCV9kVodp/NsEG', 'blank-user.png', 0, 1, 0, '2020-10-01 06:50:24', '0000-00-00 00:00:00'),
(3, 'Test', '3', 'test3@test.com', '081234567893', '', '$2b$09$S0.Gvdv.MvrUhy6ihALZOOtVsYzOyECUkoPfsj69VrTGJ99uEwD6W', 'blank-user.png', 0, 1, 0, '2020-10-01 14:14:17', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `topup_history`
--
ALTER TABLE `topup_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `topup_history`
--
ALTER TABLE `topup_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
