<?php

namespace App;

enum RequestedServiceStatus : int
{
    case TO_DO = 0;
    case IN_PROGRESS = 1;
    case DONE = 2;
    case CANCELED = 3;
}
