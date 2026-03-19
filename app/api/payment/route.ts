import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { transactionId, paymentMethod, confirm } = await request.json();

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

    // --- REFINED MOCK VERIFICATION LOGIC ---
    if (confirm) {
      // 1. Fetch current transaction to check creation time
      const { data: tx, error: fetchError } = await supabaseAdmin
        .from('transactions')
        .select('created_at')
        .eq('id', transactionId)
        .single();

      if (fetchError || !tx) {
        return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
      }

      // 2. Calculate elapsed time (simulating bank detection delay)
      const createdAt = new Date(tx.created_at).getTime();
      const now = Date.now();
      const elapsedSeconds = (now - createdAt) / 1000;

      // 3. Strict 15s delay for Bank Transfers
      const isBank = paymentMethod === 'BCA Prioritas' || paymentMethod === 'Bank Mandiri';
      const waitTime = isBank ? 15 : 5; // 15s for bank, 5s for others

      if (elapsedSeconds < waitTime) {
        return NextResponse.json(
          { 
            error: 'Transaksi kamu Belum masuk', 
            code: 'PAYMENT_PENDING',
            details: isBank ? 'Bank sedang memproses transfer Anda. Silakan coba lagi dalam beberapa detik.' : 'Sedang memverifikasi pembayaran...'
          },
          { status: 402 }
        );
      }
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

