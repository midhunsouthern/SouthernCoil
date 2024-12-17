<div class="position-relative">
    <div class="status-bar-outer">
        <div class="status-bar">
            <?php if ($row_data['cnc_nesting_status'] == 'true') : ?>
                <div title="CNC Nesting">
                    <div class="bar leftBar" style=" background-color: rgb(183, 28, 28);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Nesting.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%; " />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['cnc_punching_status'] == 'true') : ?>
                <div title="CNCPUNCHING & NUMBERING">
                    <div class="bar" style="  background-color: rgb(230, 81, 0);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Punching.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%;" />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['bending_status'] == 'true') : ?>
                <div title="END PLATE BENDING">
                    <div class="bar" style="  background-color: rgb(245, 124, 0);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Bending.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%;" />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['tcutting_status'] == 'true') : ?>
                <div title="TUBE CUTTING & BENDING">
                    <div class="bar" style="  background-color: rgb(251, 140, 0);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Tube.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%;" />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['finpunch_status'] == 'true') : ?>
                <div title="FINS PUNCHING">
                    <div class="bar" style=" background-color: rgb(251, 192, 45);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Fins.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%; " />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['ca_status'] == 'true') : ?>
                <div title="COIL ASSEMBLY">
                    <div class="bar" style="  background-color: rgb(255, 235, 59);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Assembly.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%;" />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['ce_status'] == 'true') : ?>
                <div title="COIL EXPANSION">
                    <div class="bar" style="  background-color: rgb(29, 233, 182);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Coil Expansion.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%;" />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['brazing_status'] == 'true') : ?>
                <div title="BRAZING & LEAK">
                    <div class="bar" style="background-color: rgb(0, 191, 165);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Brazing.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%;  " />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['pp_status'] == 'true') : ?>
                <div title="PAINTING & PACKING">
                    <div class="bar" style=" background-color: rgb(139, 195, 74);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Painting.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%; " />
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($row_data['dispatch_status'] == 'true') : ?>
                <div title="DISPATCH">
                    <div class="bar rightBar" style="background-color: rgb(131 244 0);">
                        <img src="<?php echo base_url('assets/customerPortal/img/appIcons/Dispatch.png') ?>" alt="brazing" style="width:50%; height:50%; margin-left:25%;" />
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>