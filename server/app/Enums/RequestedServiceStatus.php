<?php

namespace App;

enum RequestedServiceStatus : int
{
    case PENDING = 0;
    case IN_PROGRESS = 1;
    case COMPLETED = 2;
    case CANCELED = 3;
}
