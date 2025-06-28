const User = require('../entities/User');
const FirebaseRepository = require('../../../firebase/FirebaseRepository');

// Firebase 기반 사용자 저장소 (Fallback: 메모리 저장소)
class UserRepository {
  constructor() {
    // Firebase 설정 확인
    const hasFirebaseConfig = process.env.FIREBASE_PROJECT_ID && 
                             process.env.FIREBASE_PRIVATE_KEY && 
                             process.env.FIREBASE_CLIENT_EMAIL;
    
    if (hasFirebaseConfig) {
      console.log('🔥 Firebase 모드 사용');
      this.useFirebase = true;
      this.firebaseRepo = new FirebaseRepository('users');
    } else {
      console.log('💾 메모리 모드 사용 (Firebase 설정 없음)');
      this.useFirebase = false;
      // 메모리 저장소
      this.users = [
        {
          id: '1',
          email: 'user@naver.com',
          password: '0000',
          name: '테스트 사용자',
          phone: '010-1234-5678',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2', 
          email: 'admin@test.com',
          password: '0000',
          name: '관리자',
          phone: '010-9999-9999',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      this.nextId = 3;
    }
    
    // Firebase 모드일 때만 초기화
    if (this.useFirebase) {
      this.initializeTestUsers();
    }
  }

  async initializeTestUsers() {
    try {
      const existingUsers = await this.findAll();
      if (existingUsers.length === 0) {
        console.log('🔧 테스트 사용자 초기화 중...');
        
        // 테스트 사용자 1
        await this.firebaseRepo.create({
          email: 'user@naver.com',
          password: '0000',
          name: '테스트 사용자',
          phone: '010-1234-5678'
        });

        // 테스트 사용자 2 (관리자)
        await this.firebaseRepo.create({
          email: 'admin@test.com',
          password: '0000',
          name: '관리자',
          phone: '010-9999-9999'
        });

        console.log('✅ 테스트 사용자 초기화 완료');
      }
    } catch (error) {
      console.error('❌ 테스트 사용자 초기화 실패:', error.message);
    }
  }

  async findAll() {
    if (this.useFirebase) {
      try {
        const users = await this.firebaseRepo.findAll();
        return users.map(userData => new User(userData));
      } catch (error) {
        console.error('❌ Firebase 사용자 목록 조회 실패:', error.message);
        return [];
      }
    } else {
      return this.users.map(userData => new User(userData));
    }
  }

  async findByEmail(email) {
    if (this.useFirebase) {
      try {
        console.log('🔍 Firebase에서 이메일로 사용자 찾기:', email);
        const users = await this.firebaseRepo.findAll();
        const userData = users.find(user => user.email === email);
        
        if (!userData) {
          console.log('❌ Firebase에서 사용자를 찾을 수 없음:', email);
          return null;
        }
        
        console.log('✅ Firebase에서 사용자 찾음:', { id: userData.id, email: userData.email, name: userData.name });
        return new User(userData);
      } catch (error) {
        console.error('❌ Firebase 사용자 이메일 조회 실패:', error.message);
        return null;
      }
    } else {
      console.log('🔍 메모리에서 이메일로 사용자 찾기:', email);
      const userData = this.users.find(user => user.email === email);
      
      if (!userData) {
        console.log('❌ 메모리에서 사용자를 찾을 수 없음:', email);
        return null;
      }
      
      console.log('✅ 메모리에서 사용자 찾음:', { id: userData.id, email: userData.email, name: userData.name });
      return new User(userData);
    }
  }

  async createUser(userData) {
    if (this.useFirebase) {
      try {
        console.log('👤 Firebase에 새 사용자 생성:', { email: userData.email, name: userData.name });
        
        const newUser = await this.firebaseRepo.create({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          phone: userData.phone
        });
        
        console.log('✅ Firebase에 사용자 생성 성공:', { id: newUser.id, email: newUser.email });
        return new User(newUser);
      } catch (error) {
        console.error('❌ Firebase 사용자 생성 실패:', error.message);
        throw new Error('사용자 생성에 실패했습니다.');
      }
    } else {
      console.log('👤 메모리에 새 사용자 생성:', { email: userData.email, name: userData.name });
      
      const newUser = {
        id: this.nextId.toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.users.push(newUser);
      this.nextId++;
      
      console.log('✅ 메모리에 사용자 생성 성공:', { id: newUser.id, email: newUser.email });
      console.log('📝 현재 저장된 사용자들:', this.users.map(u => ({ id: u.id, email: u.email, name: u.name })));
      
      return new User(newUser);
    }
  }

  async findById(id) {
    if (this.useFirebase) {
      try {
        const users = await this.firebaseRepo.findAll();
        const userData = users.find(user => user.id === id);
        
        if (!userData) return null;
        
        return new User(userData);
      } catch (error) {
        console.error('❌ Firebase 사용자 ID 조회 실패:', error.message);
        return null;
      }
    } else {
      const userData = this.users.find(user => user.id === id);
      if (!userData) return null;
      
      return new User(userData);
    }
  }

  async updateUser(id, updateData) {
    try {
      // Firebase에서 업데이트 구현 필요
      console.log('⚠️ updateUser는 아직 Firebase로 구현되지 않음');
      return null;
    } catch (error) {
      console.error('❌ Firebase 사용자 업데이트 실패:', error.message);
      return null;
    }
  }

  async deleteUser(id) {
    try {
      // Firebase에서 삭제 구현 필요
      console.log('⚠️ deleteUser는 아직 Firebase로 구현되지 않음');
      return false;
    } catch (error) {
      console.error('❌ Firebase 사용자 삭제 실패:', error.message);
      return false;
    }
  }
}

module.exports = UserRepository;