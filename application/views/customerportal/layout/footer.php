<div class="modal" tabindex="-1" role="dialog" id="largemodal">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modal-tile">View</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body">
                <p></p>
            </div>
        </div>
    </div>
</div>

<script>
    function largeModal(url, header, jdata = null) {
        $('#largemodal').modal('show');
        $.ajax({
            type: "POST",
            url: url,
            data: jdata,
            success: function(response) {
                $('#modal-body').html(response);
                $('#modal-tile').html(header);
            },
            error: function() {
                $('#modal-body').html("Error Processing");
                $('#modal-tile').html(header);
            }
        });
    }
</script>