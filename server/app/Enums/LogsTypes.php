<?php

namespace App\Enums;

enum LogsTypes : string
{
    case INFO = 'Info';
    case ERROR = 'Error';
    case WARNING = 'Warning';
}
