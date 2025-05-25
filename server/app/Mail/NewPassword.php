<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewPassword extends Mailable
{
    use Queueable, SerializesModels;


    public $newPassword;
    public $lang;
    /**
     * Create a new message instance.
     */
    public function __construct($newPassword, $lang)
    {
        $this->newPassword = $newPassword; 
        $this->lang = $lang;

    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Shatleh New Password',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
       return new Content(
            view: 'Mail.new-password',
            with: [
                'newPassword' => $this->newPassword,
                'lang'=> $this->lang
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
