import { NextResponse } from 'next/server';

// Temporary stub endpoint to unblock DS approvals page
// Replace with real backend proxy when available
export async function GET() {
  try {
    // Return an empty applications array as a safe default
    return NextResponse.json({ applications: [] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to load applications' }, { status: 500 });
  }
}
