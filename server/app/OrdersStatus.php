<?php

namespace App;

enum OrdersStatus : int
{
    case TO_DO = 0;
    case IN_PROGRESS = 1;
    case DELEIVERED = 2;
    case CANCELED = 3;
}
