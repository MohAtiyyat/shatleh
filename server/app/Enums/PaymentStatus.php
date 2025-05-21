<?php

namespace App;

enum PaymentStatus : int
{
    case PENDING = 0;
    case COMPLETED = 1;
    case FAILED = 2;
    case REFUNDED = 3;
    case CANCELLED = 4;
}
