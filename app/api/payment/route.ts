import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { transactionId, paymentMethod } = await request.json();

    // Validasi Input Dasar
    if (!transactionId || typeof transactionId !== 'string' || transactionId.trim() === '') {
      return NextResponse.json(
        { error: 'ID Transaksi tidak valid' },
        { status: 400 }
      );
    }

    const validMethods = ['Crypto', 'Mastercard', 'BCA Prioritas', 'Bank Mandiri', 'Transfer Bank', 'E-Wallet', 'Kartu Kredit'];
    if (!paymentMethod || !validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Metode pembayaran tidak valid' },
        { status: 400 }
      );
    }

    // Update the transaction status and record the payment method
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .update({ 
        status: 'completed', 
        payment_method: paymentMethod,
        paid_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment processed successfully',
      data 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

