import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { items, totalAmount } = await request.json();

    // Validasi Input Dasar
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Keranjang belanja tidak boleh kosong' },
        { status: 400 }
      );
    }

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Total nominal tidak valid' },
        { status: 400 }
      );
    }

    // Validasi struktur item (mencegah manipulasi data)
    const isValidItems = items.every(item => 
      typeof item.name === 'string' && 
      typeof item.price === 'string' && 
      typeof item.quantity === 'number' &&
      item.quantity > 0
    );

    if (!isValidItems) {
      return NextResponse.json(
        { error: 'Format item pesanan tidak valid' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert([
        {
          items,
          total_amount: totalAmount,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      transactionId: data.id,
    });
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
