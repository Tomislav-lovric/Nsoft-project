-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2020 at 04:55 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nsoft-project`
--

-- --------------------------------------------------------

--
-- Table structure for table `stake_limits`
--

CREATE TABLE `stake_limits` (
  `id` int(11) NOT NULL,
  `time_duration` int(100) NOT NULL,
  `stake_limit` int(100) NOT NULL,
  `hot_percentage` int(100) NOT NULL,
  `restriction_expires` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stake_limits`
--

INSERT INTO `stake_limits` (`id`, `time_duration`, `stake_limit`, `hot_percentage`, `restriction_expires`) VALUES
(1, 1800, 999, 80, 600);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` varchar(255) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `stake` double(100,2) DEFAULT NULL,
  `date_received` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_exp` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `device_id` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL,
  `restriction_exp` datetime DEFAULT NULL,
  `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`device_id`, `firstName`, `lastName`, `email`, `password`, `status`, `restriction_exp`, `reg_date`) VALUES
('5193f4c7-5ec0-47fe-847e-d8a0d1bab30c', 'testNesto', 'testNesto', 'test1234@gmail.com', '$2b$10$Oip3f6xOAg5CeNkftmaHGeIuCiEtz7Fv.0TuS/YZ7uen79h49YnKa', 'OK', NULL, '2020-11-30 14:53:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `stake_limits`
--
ALTER TABLE `stake_limits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `device_id` (`device_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`device_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `stake_limits`
--
ALTER TABLE `stake_limits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `stake_limits_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `users` (`device_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
