import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

// GET - Fetch all transactions (with optional payment method filter)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentMethod = searchParams.get('payment_method');

    let query = supabaseAdmin
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (paymentMethod && paymentMethod !== 'all') {
      query = query.eq('payment_method', paymentMethod);
    }

    const { data: transactions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transactions: transactions || [] });
  } catch (error) {
    console.error('Transaction GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE - Remove a transaction by ID
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID transaksi tidak valid' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    console.error('Transaction DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
