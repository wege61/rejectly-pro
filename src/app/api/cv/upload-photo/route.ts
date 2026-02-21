import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const photo = formData.get("photo") as Blob | null;

    if (!photo) {
      return NextResponse.json(
        { error: "Photo file required" },
        { status: 400 }
      );
    }

    // Validate size (2MB max)
    if (photo.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Photo must be less than 2MB" },
        { status: 400 }
      );
    }

    const ext = photo.type === "image/png" ? "png" : "jpg";
    const fileName = `${user.id}/photos/${Date.now()}.${ext}`;
    const buffer = Buffer.from(await photo.arrayBuffer());

    // Use admin client to bypass RLS for uploads
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error: uploadError } = await supabaseAdmin.storage
      .from("cv-files")
      .upload(fileName, buffer, {
        contentType: photo.type || "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Photo upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("cv-files").getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload photo error:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
