import Swal from 'sweetalert2'

const SuccessAlert = (title) => {
    const alert = Swal.fire({
        icon : 'success',
        title : title,
        confirmButtonColor : "#008000"
    });

    return alert
}

export default SuccessAlert