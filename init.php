<?php

// Рабочее пространство имен

namespace is;

// Базовые константы

if (!defined('isENGINE')) { define('isENGINE', microtime(true)); }
if (!defined('DS')) { define('DS', DIRECTORY_SEPARATOR); }
if (!defined('DP')) { define('DP', '..' . DIRECTORY_SEPARATOR); }
if (!defined('DI')) { define('DI', realpath($_SERVER['DOCUMENT_ROOT']) . DS); }
if (!defined('DR')) { define('DR', realpath(__DIR__ . DS . DP . DP . DP) . DS); }

if (!defined('isOPTIONS')) { define('isOPTIONS', ''); }

// Подключение элементов

/*
*  Опции задаются через константу isOPTIONS
*  в виде объекта в формате json
*  
*  Доступные опции:
*  path - путь установки, например 'assets/'
*  min - задать минимизацию файла или нет
*/

function jsSearch($path, &$time) {
	
	if (!file_exists($path) || !is_dir($path)) {
		return false;
	}
	
	$path = str_replace(['/', '\\'], DS, $path);
	if (substr($path, -1) !== DS) { $path .= DS; }
	
	$scan = scandir($path);
	
	if (!is_array($scan)) {
		return false;
	}
	
	$list = [];
	$dir = [];
	
	foreach ($scan as $item) {
		//if ($item === '.' || $item === '..') {
		if (mb_substr($item, 0, 1) === '.') {
			continue;
		}
		$item = $path . $item;
		if (is_dir($item)) {
			$dir[] = $item;
		} else {
			if (mb_substr($item, -3) === '.js') {
				$list[] = $item;
				$mtime = filemtime($item);
				if ($time < $mtime) {
					$time = $mtime;
				}
			}
		}
	}
	unset($item);
	
	foreach ($dir as $item) {
		$sub = \is\jsSearch($item . DS, $time);
		if (is_array($sub)) {
			$list = array_merge($list, $sub);
		}
	}
	unset($item);
	
	return $list;
	
}

$options = isOPTIONS ? json_decode(isOPTIONS, true) : [];

$time = null;
$path = __DIR__ . DS;
$list = \is\jsSearch($path, $time);

$file = ($options['path'] ? str_replace([':', '/', '\\'], DS, $options['path']) : null) . 'frameworkjs' . ($options['min'] ? '.min' : null) . '.js';
$mtime = file_exists(DI . $file) ? filemtime(DI . $file) : null;

if ($mtime <= $time) {
	$content = null;
	$min = null;
	foreach ($list as $item) {
		$content .= file_get_contents($item) . ($options['min'] ? ';' : null) . "\n";
	}
	unset($item);
	
	if ($options['min']) {
		// clear comments [//...]
		$content = preg_replace('/([^\:\"\'])\s*?\/\/.*?($|[\r\n])/u', '$1$2', $content);
		// clear line breaks
		$content = preg_replace('/\r\n\s*|\r\s*|\n\s*/u', '', $content);
		// clear comments [/*...*/]
		$content = preg_replace('/\/\*.*?\*\//u', '', $content);
		// clear multiple spaces and trim
		$content = preg_replace('/\s/ui', ' ', $content);
		$content = preg_replace('/(\s|&nbsp;)+/ui', '$1', $content);
		$content = preg_replace('/^(\s|(&nbsp;))+/ui', '', $content);
		$content = preg_replace('/(\s|(&nbsp;))+$/ui', '', $content);
		$content = preg_replace('/(; )+/ui', '$1', $content);
		// clear spaces around signs
		$content = preg_replace('/\s*([\<\>\=\+\-\*\/\?\:\.\,\(\)\|\&\!\{\}]+)\s*/ui', '$1', $content);
	}
	
	file_put_contents(DI . $file, $content);
	$mtime = filemtime(DI . $file);
	unset($content);
}

?>