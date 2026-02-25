const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://cfjztqbrespcabiavhzy.supabase.co',
    'sb_publishable_7K7vr-v7uBpYzg9u4KIhKQ_ygNP3nx2'
);

async function checkSlugs() {
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- DB POSTS (SLUG AUDIT) ---');
    data.forEach((p, i) => {
        console.log(`${i + 1}. [${p.id}] Title: "${p.title}" | Slug: "${p.slug}" | Date: ${p.created_at}`);
    });
}

checkSlugs();
