@inject(menu, RabbitCMS\Backend\Support\Backend::class)
<div class="page-sidebar-wrapper">
    <div class="page-sidebar navbar-collapse collapse">
        <ul class="page-sidebar-menu page-header-fixed" data-auto-scroll="true" data-slide-speed="200">
            <?php $items = $menu->getAccessMenu('backend'); ?>
            @include('backend::layouts.sidebar-items')
        </ul>
    </div>
</div>
