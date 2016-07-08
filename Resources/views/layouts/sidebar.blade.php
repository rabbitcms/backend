@inject(menu, RabbitCMS\Backend\Support\Backend)
<div class="page-sidebar-wrapper">
    <div class="page-sidebar navbar-collapse collapse">
        <ul class="page-sidebar-menu page-header-fixed" data-auto-scroll="true" data-slide-speed="200">
            <?php $items = \Backend::getAccessMenu('backend'); ?>
            @include('backend::layouts.sidebar-items')
        </ul>
    </div>
</div>