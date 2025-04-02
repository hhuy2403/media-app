// Mock API service - giả lập các cuộc gọi API

// Hàm trì hoãn để mô phỏng thời gian phản hồi từ server
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 1. Dịch văn bản
export const translateText = async (text, sourceLanguage, targetLanguage) => {
    // Giả lập thời gian gọi API
    await delay(1000);

    try {
        console.log(`Translating from ${sourceLanguage} to ${targetLanguage}`);

        // Giả lập phản hồi từ API dịch
        let translatedText;
        let detectedLanguage = sourceLanguage;

        if (sourceLanguage === 'auto') {
            // Giả lập nhận dạng ngôn ngữ
            const firstChar = text.charAt(0).toLowerCase();

            if ('abcdefghijklmnopqrstuvwxyz'.includes(firstChar)) {
                detectedLanguage = 'en'; // Giả định văn bản tiếng Anh
            } else {
                detectedLanguage = 'vi'; // Giả định văn bản tiếng Việt
            }
        }

        // Giả lập kết quả dịch dựa trên ngôn ngữ
        if (targetLanguage === 'en' && (detectedLanguage === 'vi' || detectedLanguage === 'auto')) {
            translatedText = `English translation of: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;
        } else if (targetLanguage === 'vi' && (detectedLanguage === 'en' || detectedLanguage === 'auto')) {
            translatedText = `Bản dịch tiếng Việt của: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;
        } else if (targetLanguage === 'fr') {
            translatedText = `Traduction française de: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;
        } else if (targetLanguage === 'de') {
            translatedText = `Deutsche Übersetzung von: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;
        } else if (targetLanguage === 'ja') {
            translatedText = `日本語翻訳: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;
        } else {
            translatedText = `Translation to ${targetLanguage} of: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`;
        }

        return {
            translatedText,
            detectedLanguage
        };
    } catch (error) {
        console.error("Translation error:", error);
        throw new Error('Lỗi dịch văn bản: ' + error.message);
    }
};

// 2. Chuyển văn bản thành giọng nói
export const textToSpeech = async (text, voice, rate, pitch) => {
    // Giả lập thời gian gọi API
    await delay(1500);

    try {
        console.log(`Converting text to speech with voice: ${voice}, rate: ${rate}, pitch: ${pitch}`);

        // Trong môi trường thực tế, chúng ta sẽ nhận được một file audio
        // Ở đây, chúng ta sẽ sử dụng Web Speech API khi có thể để mô phỏng
        let audioUrl = null;

        // Thử sử dụng Web Speech API (chỉ hoạt động trên một số trình duyệt)
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = pitch;

            // Phân tách mã voice để lấy language code
            const languageParts = voice.split('-');
            if (languageParts.length >= 2) {
                utterance.lang = `${languageParts[0]}-${languageParts[1]}`;
            }

            // Phát audio
            window.speechSynthesis.speak(utterance);

            // Không có URL thực tế vì Web Speech API không cung cấp điều này
            // Chúng ta sẽ giả lập nó
            audioUrl = '#'; // URL giả

            return {
                success: true,
                message: 'Đã tạo giọng nói thành công (sử dụng Web Speech API của trình duyệt)',
                audioUrl,
                usesBrowserAPI: true
            };
        } else {
            // Nếu Web Speech API không khả dụng, giả lập một URL giả
            console.log('Web Speech API không khả dụng, sử dụng audio mẫu');

            // URL audio mẫu - đây là một URL tĩnh đến một file audio mẫu
            audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

            return {
                success: true,
                message: 'Đã tạo giọng nói thành công (sử dụng audio mẫu)',
                audioUrl,
                usesBrowserAPI: false
            };
        }
    } catch (error) {
        console.error("Text-to-speech error:", error);
        throw new Error('Lỗi chuyển văn bản thành giọng nói: ' + error.message);
    }
};

// 3. Chuyển đổi định dạng file media
export const convertMedia = async (file, targetFormat, options = {}) => {
    // Giả lập thời gian gọi API
    await delay(2000);

    try {
        console.log(`Converting file ${file.name} to format ${targetFormat} with options:`, options);

        // Trong môi trường thực tế, file sẽ được upload và chuyển đổi
        // Ở đây, chúng ta sẽ giả lập bằng cách sử dụng URL.createObjectURL

        // Tạo URL cho file gốc
        const originalUrl = URL.createObjectURL(file);

        // Đối với các định dạng ảnh/video/audio, chúng ta có thể cung cấp 
        // cùng một ObjectURL nhưng giả vờ nó là định dạng khác

        // Xử lý trường hợp trích xuất audio từ video
        if (options.extractAudio) {
            const audioOptions = options.audioOptions || {
                bitrate: '128',
                channels: 'stereo',
                sampleRate: '44100'
            };

            console.log(`Extracting audio from video with options:`, audioOptions);

            // Trong một ứng dụng thực tế, đây sẽ là URL đến file âm thanh đã được trích xuất
            const convertedUrl = originalUrl;

            // Tạo tên file mới cho âm thanh
            const fileNameParts = file.name.split('.');
            fileNameParts.pop(); // Loại bỏ phần mở rộng
            const newFileName = `${fileNameParts.join('.')}_audio.${targetFormat}`;

            return {
                success: true,
                message: `Đã trích xuất âm thanh từ ${file.name} sang ${targetFormat} thành công`,
                originalUrl,
                convertedUrl,
                downloadUrl: convertedUrl,
                originalFileName: file.name,
                convertedFileName: newFileName,
                audioDetails: audioOptions
            };
        }

        // Xử lý chuyển đổi thông thường
        const convertedUrl = originalUrl;

        // Tạo tên file mới với đuôi mới
        const fileNameParts = file.name.split('.');
        fileNameParts.pop(); // Loại bỏ phần mở rộng
        const newFileName = `${fileNameParts.join('.')}.${targetFormat}`;

        return {
            success: true,
            message: `Đã chuyển đổi ${file.name} sang ${targetFormat} thành công`,
            originalUrl,
            convertedUrl,
            downloadUrl: convertedUrl,
            originalFileName: file.name,
            convertedFileName: newFileName
        };
    } catch (error) {
        console.error("Media conversion error:", error);
        throw new Error('Lỗi chuyển đổi file media: ' + error.message);
    }
};

// 4. Dịch file văn bản
export const translateFile = async (file, sourceLanguage, targetLanguage) => {
    // Giả lập thời gian gọi API
    await delay(2000);

    try {
        console.log(`Translating file ${file.name} from ${sourceLanguage} to ${targetLanguage}`);

        // Đọc nội dung file nếu có thể
        let fileContent = '';
        let translatedContent = '';

        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            // Đọc nội dung file text
            fileContent = await readFileAsText(file);

            // Giả lập nội dung đã dịch
            if (targetLanguage === 'en') {
                translatedContent = `English translation of the file:\n\n${fileContent.substring(0, 100)}...`;
            } else if (targetLanguage === 'vi') {
                translatedContent = `Bản dịch tiếng Việt của file:\n\n${fileContent.substring(0, 100)}...`;
            } else {
                translatedContent = `Translation to ${targetLanguage}:\n\n${fileContent.substring(0, 100)}...`;
            }
        } else {
            // Đối với các file khác, chúng ta sẽ giả lập nội dung
            fileContent = 'Nội dung file mẫu (trong ứng dụng thực tế, nội dung sẽ được trích xuất từ file).';

            if (targetLanguage === 'en') {
                translatedContent = 'Sample file content (in a real application, content would be extracted from the file and translated to English).';
            } else if (targetLanguage === 'vi') {
                translatedContent = 'Nội dung file mẫu (trong ứng dụng thực tế, nội dung sẽ được trích xuất từ file và dịch sang tiếng Việt).';
            } else {
                translatedContent = `Sample file content translated to ${targetLanguage} (in a real application, content would be extracted and translated).`;
            }
        }

        // Tạo blob từ nội dung đã dịch
        const blob = new Blob([translatedContent], { type: 'text/plain' });
        const downloadUrl = URL.createObjectURL(blob);

        return {
            success: true,
            originalContent: fileContent,
            translatedContent,
            fileName: file.name,
            downloadUrl,
            detectedLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage
        };
    } catch (error) {
        console.error("File translation error:", error);
        throw new Error('Lỗi dịch file: ' + error.message);
    }
};

// Hàm hỗ trợ đọc file dưới dạng text
const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};

const apiServices = {
    translateText,
    convertMedia,
    textToSpeech,
    translateFile
};

export default apiServices;