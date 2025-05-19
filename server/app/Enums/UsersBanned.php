<?php

namespace App;

enum UsersBanned : int
{
    case NOT_BANNED = 0;
    case BANNED = 1;
    case TEMP_BANNED = 2;
}
