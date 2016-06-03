<?php

class BrandLovers_Comments_Helper_Data extends Mage_Core_Helper_Abstract
{
	public function getBrandLoversOptions(){
		
		$optoinArr = array('data-language' => 'pt');		
		$_options = Mage::getStoreConfig('comments/general');
		unset($_options['enabled']);
		
		foreach($_options as $options){
			if(isset($_options['data_color'])){
				$optoinArr['data-color'] = '#'.strtolower($_options['data_color']);
			}
			if(isset($_options['data_num_comments'])){
				$optoinArr['data-num-comments'] =  $_options['data_num_comments'];
			}
			if(isset($_options['data_comment'])){
				$optoinArr['data-comment'] =  $_options['data_comment'];
			}
			if(isset($_options['data_show_profile_face'])){
				$optoinArr['data-show-profile-face'] =  $_options['data_show_profile_face'];
			}
			if(isset($_options['data_font_color'])){
				$optoinArr['data-font-color'] =  '#'.strtolower($_options['data_font_color']);
			}
			if(isset($_options['data_language'])){
				$optoinArr['data-language'] =  $_options['data_language'];
			}
		}
		return $optoinArr;
	}
	
	public function getDataMode(){
		$data_mode = Mage::getStoreConfig('comments/general/data_mode');
		return $data_mode;
	}
}