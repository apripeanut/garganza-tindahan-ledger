import { NextResponse } from "next/server";
import { ROWS } from "../rows";

//collects available customer
export async function GET() {
  return NextResponse.json(ROWS);
}

//adds new customer
export async function POST(request: Request) {
  const { name, balance } = await request.json();
  const row = { id: String(Date.now()), name, balance, lastPaid: "never" };
  ROWS.push(row);
  return NextResponse.json(row, { status: 201 });
}
