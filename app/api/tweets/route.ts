import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { Tweet } from '@/types/tweet';
import { sanitizeTweet } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get('page') || '1';
    const limitParam = searchParams.get('limit') || '20';

    const parsedPage = parseInt(pageParam, 10);
    const parsedLimit = parseInt(limitParam, 10);

    if (isNaN(parsedPage) || isNaN(parsedLimit)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid parameters: page and limit must be valid numbers',
        },
        { status: 400 }
      );
    }

    const page = Math.max(1, parsedPage);
    const limit = Math.min(100, Math.max(1, parsedLimit));
    const offset = (page - 1) * limit;

    const result = await pool.query<Tweet>(
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
      FROM tweets
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM tweets');
    const total = parseInt(countResult.rows[0].count);

    const sanitizedData = result.rows.map(sanitizeTweet);

    return NextResponse.json({
      success: true,
      data: sanitizedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tweets',
        ...(process.env.NODE_ENV === 'development' && {
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    );
  }
}

