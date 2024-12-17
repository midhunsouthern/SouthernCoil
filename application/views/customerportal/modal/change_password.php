<div class="container-fluid">
    <div class="card">
        <div class="card-body">
            <?php echo form_open('customerMain/change_password') ?>
            <input type="text" name="customer_id" value="<?php echo $param1; ?>" hidden>
            <div class="input-group">
                <input type="text" class="form-control" placeholder="New Password" name="new_pwd">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="submit">Change</button>
                </div>
            </div>
            </form>
        </div>
    </div>
</div>