<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewStaff extends Mailable
{
    use Queueable, SerializesModels;

    private $staff;
    private $password;

    /**
     * Create a new message instance.
     */
    public function __construct( $staff, $password)
    {
        $this->staff = $staff;
        $this->password = $password;
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welecome to the Team',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.new-staff',
            with: [
                'staffName' => $this->staff->name,
                'staffRole' => $this->staff->getRoleNames()[0] ?? 'Employee',
                'password' => $this->password,
                'lang'=> $this->staff->lang ?? 'en',
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
