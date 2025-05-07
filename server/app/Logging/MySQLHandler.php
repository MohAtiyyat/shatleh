<?php

namespace App\Logging;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Logger;
use Monolog\LogRecord;
use Illuminate\Support\Facades\DB;

class MySQLHandler extends AbstractProcessingHandler
{
    protected $table;
    protected $connection;

    public function __construct($connection = 'mysql', $table = 'logs', $level = Logger::INFO)
    {
        $this->connection = $connection;
        $this->table = $table;
        parent::__construct($level);
    }

    protected function write(LogRecord $record): void
    {
        $context = $record->context ?? [];

        DB::connection($this->connection)->table($this->table)->insert([
            'user_id' => $context['user_id'] ?? null,
            'action' => $context['action'] ?? 'unknown',
            'log_type' => $record->level->getName(),
            'created_at' => now(),
        ]);
    }
}