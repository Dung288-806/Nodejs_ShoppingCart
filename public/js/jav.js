
$(document).ready(function () {

    // bấm vào categori
    $(".list-group-item").click(function(){
        $('.list-group-item').removeClass('active')
        $(this).addClass('active');
    });
    
     
            // Khi bấm vào để đăng Ký
            $(".Register").click(function (e) { 
                $(".modal").show();
                $(".Register-form").show(500);
             $(".Login-Form").hide();
            });
            
            $(".Login").click(function (e) { 
                $(".modal").show();
                $(".Login-Form").show(500);
            $(".Register-form").hide();
       });

        // Khi bấm vô nút đăng nhập
        $(".Register-switch").click(function(){
            
            $(".Login-Form").hide();
            $(".Register-form").show(500);
            
        });

        $(".Login-switch").click(function(){
            
            $(".Register-form").hide();
            $(".Login-Form").show(500);
        });

        $(".btn-back").click(function(){
           
            $(".modal").hide();
        });
});


function addCart(proID) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          
          document.getElementById("contentHeader").innerHTML = this.response;
        }
    };
    xhttp.open("post", `/products/add/cart/${proID}`, true);
    xhttp.send();
  }
