<!-- src/routes/(admin)/+layout.svelte -->
<script lang="ts">
    import type { LayoutData } from './$types';
    let { data, children } = $props<{ data: LayoutData, children: any }>();
</script>

<div class="admin-shell">
    <nav class="sidebar">
        <a href="/admin/webapps">Webapps</a>
    </nav>
    <main class="content">
        {@render children()}
    </main>
</div>

<style>
    .admin-shell {
        display: grid;
        grid-template-columns: 220px 1fr;
        min-height: 100vh;
    }
    .sidebar {
        background: #1a1a2e;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .sidebar a {
        color: #e2e8f0;
        text-decoration: none;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
    }
    .sidebar a:hover {
        background: rgba(255,255,255,0.1);
    }
    .content {
        padding: 2rem;
    }
</style>