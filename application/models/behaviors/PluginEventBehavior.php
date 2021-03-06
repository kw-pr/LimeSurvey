<?php

use \LimeSurvey\PluginManager\PluginEvent;

class PluginEventBehavior extends CModelBehavior
{
    public function events()
    {
        return array_merge(
            parent::events(),
            array(
                'onAfterDelete'  => 'afterDelete',
                'onAfterSave'    => 'afterSave',
                'onBeforeDelete' => 'beforeDelete',
                'onBeforeSave'   => 'beforeSave',
            )
        );
    }

    public function afterDelete(CEvent $event)
    {
        $this->dispatchPluginModelEvent('after'.get_class($this->owner).'Delete');
        $this->dispatchPluginModelEvent('afterModelDelete');
    }

    public function afterSave(CEvent $event)
    {
        $pluginManager = App()->getPluginManager();
        // Don't propagate event if we're in a shutdown, since it will lead to an infinite loop.
        if (!$pluginManager->shutdownObject->isEnabled()) {
            $this->dispatchPluginModelEvent('after'.get_class($this->owner).'Save');
            $this->dispatchPluginModelEvent('afterModelSave');
        }
    }

    public function beforeDelete(CModelEvent $event)
    {
        $this->dispatchPluginModelEvent('before'.get_class($this->owner).'Delete');
        $this->dispatchPluginModelEvent('beforeModelDelete');
    }

    public function beforeSave(CModelEvent $event)
    {
        $pluginManager = App()->getPluginManager();
        // Don't propagate event if we're in a shutdown, since it will lead to an infinite loop.
        if (!$pluginManager->shutdownObject->isEnabled()) {
            $this->dispatchPluginModelEvent('before'.get_class($this->owner).'Save');
            $this->dispatchPluginModelEvent('beforeModelSave');
        }
    }

    /**
     * method for dispatching plugin events
     *
     * See {@link find()} for detailed explanation about $condition and $params.
     * @param string $sEventName event name to dispatch
     * @param array	$criteria array containing attributes, conditions and params for the filter query
     * @return PluginEvent the dispatched event
     */
    public function dispatchPluginModelEvent($sEventName, $criteria = null)
    {
        $oPluginEvent = new PluginEvent($sEventName, $this);
        $oPluginEvent->set('model', $this->owner);
        if (isset($criteria)) {
            $oPluginEvent->set('filterCriteria', $criteria);
        }
        return App()->getPluginManager()->dispatchEvent($oPluginEvent);
    }
}
