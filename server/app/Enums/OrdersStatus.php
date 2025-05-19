<?php

namespace App;

enum OrdersStatus : int
{
    case PENDING = 0;
    case IN_PROGRESS = 1;
    case DELEIVERED = 2;
    case CANCELED = 3;
}
