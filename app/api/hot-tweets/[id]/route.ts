import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sanitizeTweet, isValidTweetId } from "@/lib/security";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;


    if (!isValidTweetId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid tweet ID format",
        },
        { status: 400 }
      );
    }

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
      WHERE tweet_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Tweet not found",
        },
        { status: 404 }
      );
    }

    const sanitizedData = sanitizeTweet(result.rows[0]);

    return NextResponse.json({
      success: true,
      data: sanitizedData,
    });
  } catch (error) {
    console.error("Error fetching tweet detail:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tweet detail",
        ...(process.env.NODE_ENV === 'development' && {
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    );
  }
}

