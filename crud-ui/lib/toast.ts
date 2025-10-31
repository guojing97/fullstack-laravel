// lib/toast.ts
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

export const showToast = (message: string, icon: 'success' | 'error' | 'warning' = 'error') => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon,
    title: message,
  })
}


export const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
});