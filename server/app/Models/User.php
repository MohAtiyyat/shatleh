<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes , HasRoles, HasApiTokens;

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
        "photo",
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

    protected $attributes = [
        'email_verified_at' => null, // Default role for new users
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

    protected $appends = ['name'];
    
    protected $dates = ['deleted_at', 'email_verified_at'];


    /**
     * Get the addresses for the user.
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Get the orders placed by the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
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

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function specialties()
    {
        return $this->belongsToMany(Specialty::class, 'expert_specialty', 'expert_id', 'specialty_id')
                    ->withTimestamps();
    }
    public function cart()
    {
        return $this->hasMany(Cart::class, 'customer_id');
    }

    public function bookmarks()
    {
        return $this->belongsToMany(Post::class, 'bookmarks')->withTimestamps();
    }

    public function getNameAttribute()
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

}
