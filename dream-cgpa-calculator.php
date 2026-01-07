<?php
/**
 * Plugin Name: Dream CGPA Calculator
 * Plugin URI: https://wordpress.org/plugins/dream-cgpa-calculator/
 * Description: A Gutenberg block to calculate and display semester-wise GPA and overall CGPA for students. Perfect for educational websites.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Dream Carnival
 * Author URI: https://profiles.wordpress.org/dreamscarnival/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: dream-cgpa-calculator
 * 
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block from the compiled build folder.
 */
function dream_cgpa_calculator_register_block() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'dream_cgpa_calculator_register_block' );

