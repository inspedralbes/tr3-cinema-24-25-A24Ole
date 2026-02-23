<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'session_id' => ['required', 'integer'],
            'seats' => ['required', 'array', 'min:1'],
            'seats.*' => ['required'], // Accept text identifiers like 'A1' or numbers like 1, 2 since Seats table is gone
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'total_price' => ['nullable', 'numeric'],
            'movie' => ['nullable', 'array'],
            'movie.id' => ['required_with:movie', 'integer'],
            'movie.title' => ['required_with:movie', 'string'],
            'movie.poster_url' => ['nullable', 'string'],
            'movie.duration_min' => ['nullable', 'integer'],
        ];
    }
}
