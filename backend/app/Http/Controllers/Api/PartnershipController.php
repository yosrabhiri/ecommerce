<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PartnershipController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brandName' => 'required|string|max:255',
            'ownerName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'website' => 'nullable|url|max:255',
            'description' => 'required|string|max:2000',
            'productCategories' => 'required|array|min:1',
            'productCategories.*' => 'string|max:100',
            'estimatedRevenue' => 'required|string|max:100',
        ]);

        // You could save this to a database here using a Partnership model
        // For now, we log the application and return a success message
        Log::info('New partnership application received:', $request->all());

        return response()->json([
            'status' => 'success',
            'message' => "Thank you, {$validated['ownerName']}! We've received your application for {$validated['brandName']}. Our team will be in touch within 3-5 business days."
        ]);
    }
}
