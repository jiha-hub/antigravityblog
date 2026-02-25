const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://cfjztqbrespcabiavhzy.supabase.co',
    'sb_publishable_7K7vr-v7uBpYzg9u4KIhKQ_ygNP3nx2'
);

async function simulateQuery(slug) {
    console.log(`Attempting to fetch: ${slug}`);
    const { data: post, error } = await supabase
        .from('posts')
        .select(`
      *,
      category:categories(name, slug),
      author:profiles(full_name, avatar_url)
    `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('ERROR:', error.message, error.code);
    } else {
        console.log('SUCCESS:', post.title);
    }
}

simulateQuery('dfs');
