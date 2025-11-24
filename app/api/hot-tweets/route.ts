import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sanitizeTweet } from "@/lib/security";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT
        tweet_id,
        user_created_at,
        user_name,
        user_screen_name,
        text,
        bookmark_count,
        created_at,
        favorite_count,
        quote_count,
        reply_count,
        retweet_count,
        media
      FROM hot_tweets
      ORDER BY created_at DESC`
    );

    const sanitizedData = result.rows.map(sanitizeTweet);

    return NextResponse.json({
      success: true,
      data: sanitizedData,
      count: sanitizedData.length,
    });
  } catch (error) {
    console.error("Error fetching hot tweets:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hot tweets",
        ...(process.env.NODE_ENV === 'development' && {
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    );
  }
}

