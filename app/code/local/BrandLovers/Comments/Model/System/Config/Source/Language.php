<?php

class BrandLovers_Comments_Model_System_Config_Source_Language
{

    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray()
    {
        return array(
            array('value' => 'en', 'label'=>Mage::helper('adminhtml')->__('English')),
            array('value' => 'pt', 'label'=>Mage::helper('adminhtml')->__('Portuguese')),
           
        );
    }

}
