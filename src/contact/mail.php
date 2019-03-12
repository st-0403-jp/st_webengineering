<?php
mb_language('Japanese');
mb_internal_encoding('UTF-8');

define('MAIL_ADMIN', 'info@sssatoru-t.info');

// サニタイズ
$cleanPost = $_POST;
// if( !empty($_POST) ) {
//     foreach( $_POST as $key => $value ) {
//         $cleanPost[$key] = htmlspecialchars( $value, ENT_QUOTES, 'UTF-8');
//     }
// }

$proc = isset($cleanPost['proc']) ? $cleanPost['proc'] : '';

if ($proc === 'send') {
    $name = isset($cleanPost['name']) ? $cleanPost['name'] : '';
    $gender = isset($cleanPost['gender']) ? $cleanPost['gender'] : '';
    $age = isset($cleanPost['age']) ? $cleanPost['age'] : '';
    $mailaddress = isset($cleanPost['mailaddress']) ? $cleanPost['mailaddress'] : '';
    $content = isset($cleanPost['content']) ? $cleanPost['content'] : '';
    sendAdmin($name, $gender, $age, $mailaddress, $content);
    sendUser($name, $gender, $age, $mailaddress, $content);
}

function sendAdmin ($name, $gender, $age, $mailaddress, $content) {
    $subject = 'ポートフォリオからお問い合わせが届きました。';

    $header = "From:".MAIL_ADMIN;

    $message = "【お名前】\n".$name."\n\n";
    $message .= "【性別】\n".$gender."\n\n";
    $message .= "【年代】\n".$age."\n\n";
    $message .= "【メールアドレス】\n".$mailaddress."\n\n";
    $message .= "【内容】\n".$content."\n\n";

    mb_send_mail(MAIL_ADMIN, $subject, $message, $header);
};

function sendUser ($name, $gender, $age, $mailaddress, $content) {
    $subject = 'お問い合わせ内容の確認';

    $header = "From:".MAIL_ADMIN;

    $message = "フォトグラファー・・のホームページです。\nこの度はお問い合わせいただき、誠にありがとうございます。\n\n";
    $message .= "下記、お問い合わせいただきました内容です\n";
    $message .= "----------\n";
    $message .= "【お名前】\n".$name."\n\n";
    $message .= "【性別】\n".$gender."\n\n";
    $message .= "【年代】\n".$age."\n\n";
    $message .= "【メールアドレス】\n".$mailaddress."\n\n";
    $message .= "【内容】\n".$content."\n\n";
    $message .= "\n";
    $message .= "----------\n\n";
    $message .= "いただきましたお問い合わせには、順次対応させていただきております。\n今しばらくお待ちくださいませ。\n\n";
    $message .= "なお、しばらく経っても連絡がない場合、\n大変恐縮ですが、再度ご連絡をいただけますと幸いでございます。\n\n";
    $message .= "どうぞよろしくお願いいたします。\n\n";
    $message .= "※こちらのメールは送信専用です。返信はできませんのでご了承くださいませ。\n";

    mb_send_mail($mailaddress, $subject, $message, $header);
};

?>