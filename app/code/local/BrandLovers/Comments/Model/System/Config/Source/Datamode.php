<?php

class BrandLovers_Comments_Model_System_Config_Source_Datamode
{

    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray()
    {
        return array(
            array('value' => 'action-shot', 'label'=>Mage::helper('adminhtml')->__('Action Shot')),
            array('value' => 'reviews', 'label'=>Mage::helper('adminhtml')->__('Reviews')),
            array('value' => 'WhereToBuy', 'label'=>Mage::helper('adminhtml')->__('Where to Buy')),
            array('value' => 'user-posts', 'label'=>Mage::helper('adminhtml')->__('User Posts')),
           
        );
    }

}
