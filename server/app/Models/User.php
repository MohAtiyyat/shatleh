<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'email_verified_at',
        'password',
        'phone_number',
        'language',
        'ip_country_id',
        'time_zone',
        'is_banned',
        'bio',
        'address_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_banned' => 'boolean',
        ];
    }

    protected $dates = ['deleted_at', 'email_verified_at'];

    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    /**
     * Get the addresses for the user.
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Get the payment information for the user.
     */
    public function paymentInfos()
    {
        return $this->hasMany(Payment_info::class);
    }

    /**
     * Get the orders placed by the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    
    /**
     * Get the reviews submitted by the user.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the country based on the user's IP.
     */
    public function country()
    {
        return $this->belongsTo(Country::class, 'ip_country_id');
    }

    /**
     * Get the user's default address.
     */
    public function defaultAddress()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    Public function expert_specialty(){
        return $this->belongsToMany(Specialty::class , 'expert_specialty' , 'user_id' , 'specialty_id')->as('expert_specialties')->withTimestamps();
    }
    
    
    public function shops()
    {
        return $this->hasMany(Shop::class, 'employee_id');
    }
}
