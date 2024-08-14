-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2024 at 04:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cashiering_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `heldorderitems`
--

CREATE TABLE `heldorderitems` (
  `held_order_item_id` int(11) NOT NULL,
  `held_order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_time` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `heldorderitems`
--

INSERT INTO `heldorderitems` (`held_order_item_id`, `held_order_id`, `product_id`, `quantity`, `price_at_time`) VALUES
(29, 28, 7, 1, 150),
(30, 29, 7, 100, 150),
(31, 30, 7, 10, 150),
(32, 31, 7, 1, 150);

-- --------------------------------------------------------

--
-- Table structure for table `heldorders`
--

CREATE TABLE `heldorders` (
  `held_order_id` int(11) NOT NULL,
  `customer_id` varchar(100) NOT NULL,
  `cashier_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `status` enum('active','resumed','cancelled') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `heldorders`
--

INSERT INTO `heldorders` (`held_order_id`, `customer_id`, `cashier_id`, `created_at`, `updated_at`, `status`) VALUES
(28, 'maloi', 1, '2024-08-14 05:37:29', '2024-08-14 05:37:29', 'resumed'),
(29, 'inky', 1, '2024-08-14 15:21:00', '2024-08-14 15:21:00', 'resumed'),
(30, 'Whitney', 1, '2024-08-14 15:24:35', '2024-08-14 15:24:35', 'resumed'),
(31, 'whitney', 1, '2024-08-14 15:27:17', '2024-08-14 15:27:17', 'resumed');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `barcode` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `barcode`, `name`, `price`, `stock_quantity`, `created_at`, `updated_at`) VALUES
(2, '1002', 'Chowlongs', 1000.00, 1000, '2024-08-11 13:32:05', '2024-08-12 02:21:37'),
(5, '10024', 'Orange', 150.00, 1000, '2024-08-11 14:00:14', '2024-08-12 02:19:19'),
(6, '1003', 'Bulad Pinikas', 150.00, 1000, '2024-08-11 14:01:05', '2024-08-11 14:01:05'),
(7, '1004', 'Lemon Zest', 150.00, 10000, '2024-08-11 14:05:09', '2024-08-12 02:22:09'),
(8, '1007', 'Brief ni superman', 150.00, 15000, '2024-08-11 14:05:52', '2024-08-11 14:05:52');

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` int(11) NOT NULL,
  `shift_start` time NOT NULL DEFAULT current_timestamp(),
  `shift_end` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shifts`
--

INSERT INTO `shifts` (`id`, `shift_start`, `shift_end`, `created_at`) VALUES
(1, '08:00:00', '12:00:00', '2024-08-08 12:04:15'),
(2, '12:01:00', '19:00:00', '2024-08-14 11:23:49');

-- --------------------------------------------------------

--
-- Table structure for table `shift_summaries`
--

CREATE TABLE `shift_summaries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_sales` decimal(10,2) NOT NULL,
  `total_transactions` int(11) NOT NULL,
  `total_voids` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `cashier_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `change_amount` decimal(10,2) NOT NULL,
  `status` enum('completed','voided','suspended','resumed') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `transaction_date`, `cashier_id`, `total_amount`, `paid_amount`, `change_amount`, `status`, `created_at`) VALUES
(9, '2024-08-12 21:48:17', 1, 45150.00, 100000.00, 54850.00, 'completed', '2024-08-13 05:48:17'),
(10, '2024-08-12 23:16:45', 5, 100000.00, 150000.00, 50000.00, 'completed', '2024-08-13 07:16:46'),
(11, '2024-08-12 23:20:26', 5, 150.00, 150.00, 0.00, 'completed', '2024-08-13 07:20:26'),
(12, '2024-08-13 00:26:58', 5, 45000.00, 50000.00, 5000.00, 'completed', '2024-08-13 08:26:58'),
(13, '2024-08-13 03:30:57', 5, 18000.00, 20000.00, 2000.00, 'completed', '2024-08-13 11:30:57'),
(14, '2024-08-13 03:32:10', 5, 150000.00, 200000.00, 50000.00, 'completed', '2024-08-13 11:32:10'),
(15, '2024-08-13 18:16:28', 1, 100000.00, 100000.00, 0.00, 'completed', '2024-08-14 02:16:28'),
(16, '2024-08-13 22:06:53', 1, 15150.00, 15150.00, 0.00, 'completed', '2024-08-14 06:06:53'),
(17, '2024-08-13 22:08:38', 1, 15000.00, 20000.00, 5000.00, 'completed', '2024-08-14 06:08:38'),
(18, '2024-08-13 22:10:27', 1, 15000.00, 20000.00, 5000.00, 'completed', '2024-08-14 06:10:27'),
(19, '2024-08-13 22:10:54', 1, 15000.00, 20000.00, 5000.00, 'completed', '2024-08-14 06:10:54'),
(20, '2024-08-13 22:11:23', 1, 1500.00, 2000.00, 500.00, 'completed', '2024-08-14 06:11:23'),
(21, '2024-08-13 22:18:04', 1, 10000.00, 10000.00, 0.00, 'completed', '2024-08-14 06:18:04'),
(22, '2024-08-13 22:19:43', 1, 1500.00, 2000.00, 500.00, 'completed', '2024-08-14 06:19:43'),
(23, '2024-08-14 00:57:20', 1, 15000.00, 20000.00, 5000.00, 'completed', '2024-08-14 08:57:20'),
(24, '2024-08-14 01:00:16', 1, 1500.00, 2000.00, 500.00, 'completed', '2024-08-14 09:00:16'),
(25, '2024-08-14 01:02:40', 1, 1500.00, 2000.00, 500.00, 'completed', '2024-08-14 09:02:40'),
(26, '2024-08-14 05:21:15', 1, 15000.00, 15000.00, 0.00, 'completed', '2024-08-14 13:21:15'),
(27, '2024-08-14 05:22:42', 1, 15000.00, 15000.00, 0.00, 'completed', '2024-08-14 13:22:42'),
(28, '2024-08-14 05:24:24', 1, 1500.00, 1500.00, 0.00, 'completed', '2024-08-14 13:24:24'),
(29, '2024-08-14 05:25:01', 1, 1500.00, 1500.00, 0.00, 'completed', '2024-08-14 13:25:01'),
(30, '2024-08-14 05:27:28', 1, 150.00, 200.00, 50.00, 'completed', '2024-08-14 13:27:28'),
(31, '2024-08-14 05:32:28', 1, 1500.00, 1630.00, 130.00, 'completed', '2024-08-14 13:32:28');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_items`
--

CREATE TABLE `transaction_items` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_items`
--

INSERT INTO `transaction_items` (`id`, `transaction_id`, `product_id`, `quantity`, `price`, `subtotal`) VALUES
(10, 9, 7, 100, 150.00, 15000.00),
(11, 9, 5, 100, 150.00, 15000.00),
(12, 9, 6, 1, 150.00, 150.00),
(13, 9, 8, 100, 150.00, 15000.00),
(14, 10, 2, 100, 1000.00, 100000.00),
(15, 11, 7, 1, 150.00, 150.00),
(16, 12, 8, 300, 150.00, 45000.00),
(17, 13, 7, 120, 150.00, 18000.00),
(18, 14, 5, 1000, 150.00, 150000.00),
(19, 15, 2, 100, 1000.00, 100000.00),
(20, 16, 7, 100, 150.00, 15000.00),
(21, 16, 8, 1, 150.00, 150.00),
(22, 17, 5, 100, 150.00, 15000.00),
(23, 18, 7, 100, 150.00, 15000.00),
(24, 19, 5, 100, 150.00, 15000.00),
(25, 20, 7, 10, 150.00, 1500.00),
(26, 21, 2, 10, 1000.00, 10000.00),
(27, 22, 7, 10, 150.00, 1500.00),
(28, 23, 7, 100, 150.00, 15000.00),
(29, 24, 7, 10, 150.00, 1500.00),
(30, 25, 5, 10, 150.00, 1500.00),
(31, 28, 7, 10, 150.00, 1500.00),
(32, 30, 7, 1, 150.00, 150.00),
(33, 31, 7, 10, 150.00, 1500.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `lastname` varchar(30) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `role` enum('cashier','admin') NOT NULL,
  `status` varchar(30) NOT NULL,
  `shift_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `password`, `image`, `role`, `status`, `shift_id`, `created_at`) VALUES
(1, 'Mariah Queen', 'Arceta', 'aiahkins', 'pass', '/images/aiahkins (1).jpg', 'cashier', 'active', 1, '2024-08-08 12:03:54'),
(2, 'Mary', 'Loi', 'maloiskie', 'pass', '', 'admin', 'active', 0, '2024-08-08 12:11:01'),
(4, 'John', 'Doe', 'johndoe', 'password123', '/images/aiahkins (1).jpg', 'cashier', 'active', 1, '2024-08-12 04:56:19'),
(5, 'Jho', 'Robles', 'jhojho', 'pass', '/images/jho (1).jpg', 'cashier', 'active', 2, '2024-08-12 05:17:16');

-- --------------------------------------------------------

--
-- Table structure for table `void_items`
--

CREATE TABLE `void_items` (
  `pid` int(11) NOT NULL,
  `cashier_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `void_reason` varchar(255) NOT NULL,
  `void_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `void_status` enum('pending','voided','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `void_items`
--

INSERT INTO `void_items` (`pid`, `cashier_id`, `product_id`, `amount`, `void_reason`, `void_date`, `void_status`) VALUES
(28, 1, 7, 15000, 'Whatever reason that is', '2024-08-14 13:37:29', 'voided');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `heldorderitems`
--
ALTER TABLE `heldorderitems`
  ADD PRIMARY KEY (`held_order_item_id`),
  ADD KEY `held_order_id` (`held_order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `heldorders`
--
ALTER TABLE `heldorders`
  ADD PRIMARY KEY (`held_order_id`),
  ADD KEY `cashier_id` (`cashier_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `barcode` (`barcode`);

--
-- Indexes for table `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shift_summaries`
--
ALTER TABLE `shift_summaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_ibfk_1` (`cashier_id`);

--
-- Indexes for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shift_id` (`shift_id`);

--
-- Indexes for table `void_items`
--
ALTER TABLE `void_items`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `cashier_id` (`cashier_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `heldorderitems`
--
ALTER TABLE `heldorderitems`
  MODIFY `held_order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `heldorders`
--
ALTER TABLE `heldorders`
  MODIFY `held_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shift_summaries`
--
ALTER TABLE `shift_summaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `transaction_items`
--
ALTER TABLE `transaction_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `void_items`
--
ALTER TABLE `void_items`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `heldorderitems`
--
ALTER TABLE `heldorderitems`
  ADD CONSTRAINT `heldorderitems_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `heldorderitems_ibfk_2` FOREIGN KEY (`held_order_id`) REFERENCES `heldorders` (`held_order_id`) ON DELETE CASCADE;

--
-- Constraints for table `heldorders`
--
ALTER TABLE `heldorders`
  ADD CONSTRAINT `heldorders_ibfk_1` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shift_summaries`
--
ALTER TABLE `shift_summaries`
  ADD CONSTRAINT `shift_summaries_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `transaction_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `transaction_items_ibfk_3` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `void_items`
--
ALTER TABLE `void_items`
  ADD CONSTRAINT `void_items_ibfk_2` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `void_items_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
