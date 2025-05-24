<?php

namespace App\Traits;

use App\Models\Log;

trait HelperTrait
{
    public function logAction($userId, $action, $message, $logType = 'info')
    {
        Log::create([
            'user_id' => $userId,
            'action' => $action,
            'message' => $message,
            'log_type' => $logType,
        ]);
    }
}
