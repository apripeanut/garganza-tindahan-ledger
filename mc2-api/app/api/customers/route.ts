import { NextResponse } from "next/server";
import { ROWS } from "../rows";

export async function GET() {
  return NextResponse.json(ROWS);
}
