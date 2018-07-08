extern crate base64;
extern crate buttercup_crypto;
extern crate hex;
extern crate uuid;

use buttercup_crypto::derivation::pbkdf2;
use buttercup_crypto::encryption::cbc;
use buttercup_crypto::random::{generate_iv, generate_string};
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_uint};
use uuid::Uuid;

fn glued_result(string_list: Vec<String>) -> Vec<u8> {
    let joined = string_list.join("$");
    let joined_bytes = joined.as_bytes();
    joined_bytes.to_vec()
}

#[no_mangle]
pub unsafe extern "C" fn pbkdf2_derive(
    password: *const c_char,
    salt: *const c_char,
    iterations: c_uint,
    bits: c_uint,
) -> *mut c_char {
    let password_str = CStr::from_ptr(password);
    let salt_str = CStr::from_ptr(salt);
    let result = pbkdf2(
        password_str.to_str().unwrap(),
        salt_str.to_str().unwrap(),
        iterations as usize,
        bits as usize,
    );
    let result_hex = hex::encode(result);
    CString::from_vec_unchecked(Vec::from(result_hex)).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn encrypt_cbc(
    base64_data: *const c_char, // UTF8 String
    key: *const c_char,         // Hex
    salt: *const c_char,        // UTF8 String
    iv_hex: *const c_char,      // Hex
    hmac_key: *const c_char,    // Hex
) -> *mut c_char {
    let data_str = base64::decode(CStr::from_ptr(base64_data).to_bytes()).unwrap();
    let key_str = hex::decode(CStr::from_ptr(key).to_bytes()).unwrap();
    let salt_str = CStr::from_ptr(salt).to_bytes();
    let iv_bytes = hex::decode(CStr::from_ptr(iv_hex).to_bytes()).unwrap();
    let hmac_str = hex::decode(CStr::from_ptr(hmac_key).to_bytes()).unwrap();

    let result = cbc::encrypt(
        data_str.as_slice(),
        key_str.as_slice(),
        salt_str,
        iv_bytes.as_slice(),
        hmac_str.as_slice(),
    );

    let (base64_result, hmac_code, iv, new_salt) = result.ok().unwrap();
    let glue = glued_result(vec![
        base64_result,
        hex::encode(hmac_code),
        hex::encode(iv),
        String::from_utf8_unchecked(new_salt),
    ]);

    CString::from_vec_unchecked(glue).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn decrypt_cbc(
    base64_data: *const c_char, // UTF8 String
    key: *const c_char,         // Hex
    iv: *const c_char,          // Hex
    salt: *const c_char,        // UTF8 String
    hmac_key: *const c_char,    // Hex
    hmac: *const c_char,        // Hex
) -> *mut c_char {
    let data_str = CStr::from_ptr(base64_data).to_bytes();
    let key_str = hex::decode(CStr::from_ptr(key).to_bytes()).unwrap();
    let iv_str = hex::decode(CStr::from_ptr(iv).to_bytes()).unwrap();
    let salt_str = CStr::from_ptr(salt).to_bytes();
    let hmac_key_str = hex::decode(CStr::from_ptr(hmac_key).to_bytes()).unwrap();
    let hmac_str = hex::decode(CStr::from_ptr(hmac).to_bytes()).unwrap();

    let result = cbc::decrypt(
        data_str,
        key_str.as_slice(),
        iv_str.as_slice(),
        salt_str,
        hmac_key_str.as_slice(),
        hmac_str.as_slice(),
    );

    let decrypted_result = result.ok().unwrap();
    let decrypted_base64 = base64::encode(decrypted_result.as_slice());

    CString::from_vec_unchecked(Vec::from(decrypted_base64)).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn generate_uuid_list(count: c_uint) -> *mut c_char {
    let mut list = Vec::<String>::new();
    for _ in 0..count as usize {
        list.push(format!("{}", Uuid::new_v4()));
    }
    let string = list.join(",");
    CString::from_vec_unchecked(Vec::from(string)).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn generate_salt(length: c_uint) -> *mut c_char {
    let salt = generate_string(length as usize);
    CString::from_vec_unchecked(Vec::from(salt)).into_raw()
}

#[no_mangle]
pub unsafe extern "C" fn generate_random_bytes() -> *mut c_char {
    let iv = hex::encode(generate_iv());
    CString::from_vec_unchecked(Vec::from(iv)).into_raw()
}

#[cfg(target_os = "android")]
#[allow(non_snake_case)]
pub mod android {
    extern crate jni;

    use self::jni::objects::{JClass, JString};
    use self::jni::sys::{jlong, jstring};
    use self::jni::JNIEnv;
    use super::*;

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_deriveKeyFromPassword(
        env: JNIEnv,
        _: JClass,
        password: JString,
        salt: JString,
        iterations: c_uint,
        bits: c_uint,
    ) -> jstring {
        let password: String = env
            .get_string(password)
            .expect("Couldn't get password.")
            .into();
        let salt: String = env.get_string(salt).expect("Couldn't get salt.").into();

        let result = pbkdf2(&password, &salt, iterations as usize, bits as usize);

        let output = env
            .new_string(hex::encode(result))
            .expect("Couldn't create derivation result as hex.");

        output.into_inner()
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_generateUUIDList(
        env: JNIEnv,
        _: JClass,
        count: c_uint,
    ) -> jstring {
        let mut list = Vec::<String>::new();
        for _ in 0..count {
            list.push(format!("{}", Uuid::new_v4()));
        }
        let output = env
            .new_string(list.join(","))
            .expect("Couldn't create java string!");

        output.into_inner()
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_generateSalt(
        env: JNIEnv,
        _: JClass,
        length: c_uint,
    ) -> jstring {
        let salt = generate_string(length as usize);
        let output = env.new_string(salt).expect("Couldn't create salt string");

        output.into_inner()
    }

    #[no_mangle]
    pub extern "system" fn Java_com_buttercup_Crypto_generateRandomBytes(
        env: JNIEnv,
        _: JClass,
    ) -> jstring {
        let iv = generate_iv();
        let output = env
            .new_string(hex::encode(iv))
            .expect("Couldn't create salt string");

        output.into_inner()
    }

}
