import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phoneNumber } = body;

        // Phone authentication flow:
        // 1. Validate phone number format
        // 2. Generate OTP code
        // 3. Send SMS via Twilio/AWS SNS/etc
        // 4. Store OTP in database/cache with expiration
        // 5. Return success response

        if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
            return NextResponse.json(
                { error: 'Invalid phone number' },
                { status: 400 }
            );
        }

        // For development/demo
        if (process.env.NODE_ENV !== 'production') {
            const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
            console.log('📱 Phone Auth initiated');
            console.log('📞 Phone:', phoneNumber);
            console.log('🔢 OTP Code (demo):', mockOTP);

            return NextResponse.json({
                success: true,
                message: 'OTP sent successfully',
                // In production, NEVER return the OTP in the response!
                debug: { otp: mockOTP }
            });
        }

        // Production: Send real SMS
        // const otp = generateOTP();
        // await sendSMS(phoneNumber, `Your Velo verification code is: ${otp}`);
        // await storeOTP(phoneNumber, otp);

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Phone auth error:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    // Verify OTP
    try {
        const body = await request.json();
        const { phoneNumber, otp } = body;

        if (!phoneNumber || !otp) {
            return NextResponse.json(
                { error: 'Phone number and OTP required' },
                { status: 400 }
            );
        }

        // Verify OTP from database/cache
        // const isValid = await verifyOTP(phoneNumber, otp);

        // For development/demo
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔐 Verifying OTP');
            console.log('📞 Phone:', phoneNumber);
            console.log('🔢 OTP:', otp);

            const response = NextResponse.json({
                success: true,
                message: 'Phone verified successfully'
            });

            response.cookies.set('velo-session', 'demo-phone-session-token', {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });

            return response;
        }

        return NextResponse.json({
            success: true,
            message: 'Phone verified successfully'
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        return NextResponse.json(
            { error: 'Invalid OTP' },
            { status: 400 }
        );
    }
}

function isValidPhoneNumber(phone: string): boolean {
    // Basic validation - in production use libphonenumber-js
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}
